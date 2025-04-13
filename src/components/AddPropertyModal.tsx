import { Modal, Form, Input, Select, InputNumber, Upload, Button, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import type { Property, PropertyFormData } from '@/types/interfaces';
import { useAuthStore } from '@/store/useAuthStore';

interface AddPropertyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
  property?: Property | null;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  isEditing = false,
  property = null
}) => {
  const { currentLoggedInUserId } = useAuthStore();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesModified, setImagesModified] = useState(false);

  // Reset form and set initial values when modal is opened or property changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);
      setImagesModified(false);
      
      if (isEditing && property) {
        form.setFieldsValue({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          amenities: property.amenities,
          listingType: property.listingType,
        });
        
        // Store existing images for reference
        setExistingImages(property.images || []);
        
        // Create mock UploadFile objects for existing images
        const mockFileList = property.images.map((url, index) => ({
          uid: `-${index}`, // negative uid for existing files
          name: `image-${index}.jpg`,
          status: 'done',
          url: url,
          // Flag to identify existing images
          isExisting: true,
        })) as any[];
        
        setFileList(mockFileList);
      }
    }
  }, [visible, property, isEditing, form]);

  const handleSubmit = async (values: Omit<PropertyFormData, 'images' | 'sellerId'>) => {
    setSubmitting(true);
    try {
      // Always use FormData for both create and edit operations
      const formData = new FormData();
      
      // Append form fields
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Handle images differently based on create/edit mode
      if (isEditing && property) {
        // Add property ID for edit operations
        formData.append('id', property._id as string);
        
        // Handle images for edit operations
        if (imagesModified) {
          // If user has modified images, upload the new ones
          const newImages = fileList.filter(file => !(file as any).isExisting);
          
          if (newImages.length > 0) {
            newImages.forEach((file) => {
              if (file instanceof File) {
                formData.append('images', file);
              } else if (file.originFileObj) {
                formData.append('images', file.originFileObj);
              }
            });
          }
          
          // Add a flag to indicate images were modified
          formData.append('imagesModified', 'true');
          
          // Add existing images to keep
          const keepExistingImages = fileList
            .filter(file => (file as any).isExisting)
            .map(file => file.url);
          
          formData.append('keepExistingImages', JSON.stringify(keepExistingImages));
        } else {
          // If images weren't modified, keep the existing ones
          formData.append('keepExistingImages', JSON.stringify(existingImages));
        }
        
        // Make a PUT request with FormData
        await axios.put('/api/property', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        message.success('Property updated successfully');
      } else {
        // Handle create operation - standard image handling
        fileList.forEach((file) => {
          if (file instanceof File) {
            formData.append('images', file);
          } else if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });

        if (currentLoggedInUserId) {
          formData.append('sellerId', currentLoggedInUserId);
        } else {
          message.error('User ID is not available.');
          setSubmitting(false);
          return;
        }

        await axios.post('/api/property', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        message.success('Property created successfully');
      }
      
      form.resetFields();
      setFileList([]);
      setImagesModified(false);
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      message.error(`Failed to ${isEditing ? 'update' : 'create'} property: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      setImagesModified(true);
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
    beforeUpload: (file: UploadFile) => {
      setImagesModified(true);
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
    multiple: true,
  };

  // Validate images based on create/edit mode
  const validateImages = () => {
    if (isEditing) {
      // For edit mode, if images are modified, apply validation
      if (imagesModified && fileList.length < 2) {
        return Promise.reject(new Error('Please upload at least 2 images'));
      }
      return Promise.resolve();
    }
    
    // For create mode, always validate
    if (fileList.length < 2 || fileList.length > 6) {
      return Promise.reject(new Error('Please upload between 2 and 6 images'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={isEditing ? "Edit Property" : "Add New Property"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please enter a location' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="propertyType" label="Property Type" rules={[{ required: true, message: 'Please select a property type' }]}>
              <Select>
                {[
                  'apartment', 'house', 'condo', 'land', 'studio', 'villa', 'townhouse', 
                  'penthouse', 'duplex', 'bungalow', 'cottage', 'mansion', 'farmhouse', 
                  'chalet', 'loft', 'mobile home', 'co-op', 'commercial', 'industrial', 
                  'mixed-use', 'ranch'
                ].map((type) => (
                  <Select.Option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="bedrooms" label="Bedrooms" rules={[{ required: true, message: 'Please enter number of bedrooms' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bathrooms" label="Bathrooms" rules={[{ required: true, message: 'Please enter number of bathrooms' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="area" label="Area (sq ft)" rules={[{ required: true, message: 'Please enter the area' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="listingType" label="Listing Type" rules={[{ required: true, message: 'Please select a listing type' }]}>
              <Select>
                <Select.Option value="sale">Sale</Select.Option>
                <Select.Option value="rental">Rental</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="amenities" label="Amenities" rules={[{ required: true, message: 'Please select at least one amenity' }]}>
              <Select mode="multiple">
                <Select.Option value="pool">Pool</Select.Option>
                <Select.Option value="gym">Gym</Select.Option>
                <Select.Option value="parking">Parking</Select.Option>
                <Select.Option value="garden">Garden</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={`Images (2-6 required)`}
              rules={[
                {
                  validator: validateImages,
                },
              ]}
            >
              <Upload
                {...uploadProps}
                accept="image/*"
                listType="picture"
                maxCount={6}
              >
                {fileList.length < 6 && (
                  <Button icon={<UploadOutlined />}>Upload Images</Button>
                )}
              </Upload>
              {isEditing && (
                <div style={{ marginTop: 8, color: '#666' }}>
                  {imagesModified 
                    ? 'Image changes detected. Please make sure you have at least 2 images.' 
                    : 'You can keep the existing images or upload new ones.'}
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={
              (!isEditing && (fileList.length < 2 || fileList.length > 6)) || 
              (isEditing && imagesModified && fileList.length < 2)
            }
          >
            {isEditing ? 'Update Property' : 'Create Property'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPropertyModal;