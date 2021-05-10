import {
  CalendarTwoTone,
  DeleteTwoTone,
  EditTwoTone,
  HourglassTwoTone,
} from '@ant-design/icons';
import { Card, Dropdown, Menu, Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import './styles.css';
const typeList = ['One Time', 'Day(s)', 'Week(s)', 'Month(s)', 'Year(s)'];
const colorList = ['error', 'warning', 'success'];
const messageList = ['Disabled', 'Active', 'Finished'];
const RuleCard = ({ item, loading, onDelete, onEdit }) => {
  const { Meta } = Card;
  return (
    <Card loading={loading}>
      <Meta title={item.name} description={item.description} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 20,
          marginBottom: 20,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <CalendarTwoTone twoToneColor="#26de81" />
          <span style={{ marginLeft: 5 }}>{`${moment(item.startDate).format(
            'MMM Do YYYY'
          )} - ${moment(item.endDate).format('MMM Do YYYY')}`}</span>
        </div>
        <div>
          <HourglassTwoTone twoToneColor="#f2911b" />
          <span style={{ marginLeft: 5 }}>{`${item.interval} ${
            typeList[item.intervalType - 1]
          }`}</span>
        </div>
      </div>
      <span>
        <Tag color={colorList[item.status]}>{messageList[item.status]}</Tag>
      </span>
    </Card>
  );
};

export default RuleCard;
