import React, { PureComponent } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatIntegerNumber } from '../../../util/utilities';

class CustomizedLabel extends PureComponent {
    render() {
        const {
            x, y, stroke, value, width
        } = this.props;

        return <text x={x + width / 2} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor="middle">{formatIntegerNumber(value)}</text>;
    }
}

export class UniqueProductSourcing extends PureComponent {

    render() {
        const { data } = this.props
        const formattedData = data
            .map(d => ({ name: d.productCategoryName, total: d.total }))
            .sort((a, b) => a.name > b.name ? 1 : -1)
        return (
            <ResponsiveContainer>
                <BarChart
                    data={formattedData}
                    margin={{
                        top: 5, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#999" label={<CustomizedLabel />} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
