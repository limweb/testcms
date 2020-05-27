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

export class UniqueBusinessFunction extends PureComponent {

    render() {
        const data = this.props.data
            .map(d => ({ name: d.business, ['Unique Visitors']: d.total }))
            .sort((a, b) => a.name > b.name ? 1 : -1)

        return (
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 5, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Unique Visitors" fill="#ee3135" label={<CustomizedLabel />} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
