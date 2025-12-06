import { useEffect } from 'react';
import {
  Descriptions,
  Tag,
  Form,
  Select,
  InputNumber,
  Row,
  Col,
  Card,
  Statistic,
} from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { billingModelOptions } from '@/utils/options';

export default function Billing({
  matter,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isSaving,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.setFieldsValue({
        billing: matter.billing || {},
      });
    }
  }, [matter, formData, form]);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onFormChange(values);
  };

  if (formData) {
    return (
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item label="Billing Model" name={['billing', 'billingModel']}>
              <Select options={billingModelOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Currency" name={['billing', 'currency']}>
              <Select
                options={[
                  { label: 'USD ($)', value: 'USD' },
                  { label: 'EUR (€)', value: 'EUR' },
                  { label: 'GBP (£)', value: 'GBP' },
                  { label: 'TRY (₺)', value: 'TRY' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Hourly Rate"
              name={['billing', 'hourlyRate']}
              dependencies={[['billing', 'billingModel']]}
            >
              {({ getFieldValue }) =>
                getFieldValue(['billing', 'billingModel']) === 'hourly' ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    step={50}
                    formatter={(value) =>
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                  />
                ) : (
                  <InputNumber disabled style={{ width: '100%' }} />
                )
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Billing Model">
            <Tag color="blue">
              {matter.billing?.billingModel?.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {matter.billing?.currency}
          </Descriptions.Item>
          {matter.billing?.billingModel === 'hourly' && (
            <Descriptions.Item label="Hourly Rate">
              ${matter.billing?.hourlyRate?.toLocaleString()}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Billed"
              value={matter.financials?.totalBilled}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Paid"
              value={matter.financials?.totalPaid}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Outstanding"
              value={matter.financials?.outstanding}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Retainer Balance"
              value={matter.financials?.retainerBalance}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
