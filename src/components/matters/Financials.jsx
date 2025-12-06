'use client';

import { Card, Row, Col, Statistic, Table, Tag, Progress } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useGetInvoicesByMatterQuery } from '@/rtk/api/invoiceApi';
import { useGetPaymentsByMatterQuery } from '@/rtk/api/paymentApi';
import dayjs from 'dayjs';

export default function MatterFinancials({ matter }) {
  const { data: invoicesData } = useGetInvoicesByMatterQuery(matter._id);
  const { data: paymentsData } = useGetPaymentsByMatterQuery(matter._id);

  const invoices = invoicesData || [];
  const payments = paymentsData || [];

  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text) => <span className="font-mono">{text}</span>,
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (date ? dayjs(date).format('MMM D, YYYY') : '-'),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount?.toLocaleString()}`,
    },
    {
      title: 'Balance Due',
      dataIndex: 'balanceDue',
      key: 'balanceDue',
      render: (amount) => `$${amount?.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={
            status === 'paid'
              ? 'green'
              : status === 'overdue'
              ? 'red'
              : status === 'issued'
              ? 'blue'
              : 'default'
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount?.toLocaleString()}`,
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag>{method?.replace('_', ' ').toUpperCase()}</Tag>,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
  ];

  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );
  const totalPaid = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  const collectionRate =
    totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Billed"
              value={matter.financials?.totalBilled || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Paid"
              value={matter.financials?.totalPaid || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Outstanding"
              value={matter.financials?.outstanding || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Collection Rate"
              value={collectionRate}
              suffix="%"
              valueStyle={{
                color: collectionRate > 80 ? '#52c41a' : '#fa541c',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Collection Progress */}
      <Card title="Collection Progress">
        <Progress
          percent={Math.round(collectionRate)}
          status={collectionRate === 100 ? 'success' : 'active'}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Paid: ${totalPaid.toLocaleString()}</span>
          <span>Invoiced: ${totalInvoiced.toLocaleString()}</span>
        </div>
      </Card>

      {/* Invoices */}
      <Card
        title={
          <span>
            <FileTextOutlined className="mr-2" />
            Invoices ({invoices.length})
          </span>
        }
      >
        <Table
          dataSource={invoices}
          columns={invoiceColumns}
          pagination={false}
          size="small"
          rowKey="_id"
        />
      </Card>

      {/* Payments */}
      <Card
        title={
          <span>
            <CreditCardOutlined className="mr-2" />
            Payments ({payments.length})
          </span>
        }
      >
        <Table
          dataSource={payments}
          columns={paymentColumns}
          pagination={false}
          size="small"
          rowKey="_id"
        />
      </Card>
    </div>
  );
}
