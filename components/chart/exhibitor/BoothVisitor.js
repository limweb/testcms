import React, { PureComponent } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
    {
        name: 'Page A', ['Time visited']: 4000, ['Unique']: 2400, amt: 2400,
    },
    {
        name: 'Page B', ['Time visited']: 3000, ['Unique']: 1398, amt: 2210,
    },
    {
        name: 'Page C', ['Time visited']: 2000, ['Unique']: 9800, amt: 2290,
    },
    {
        name: 'Page D', ['Time visited']: 2780, ['Unique']: 3908, amt: 2000,
    },
    {
        name: 'Page E', ['Time visited']: 1890, ['Unique']: 4800, amt: 2181,
    },
    {
        name: 'Page F', ['Time visited']: 2390, ['Unique']: 3800, amt: 2500,
    },
    {
        name: 'Page G', ['Time visited']: 3490, ['Unique']: 4300, amt: 2100,
    },
];

class CustomizedLabel extends PureComponent {
    render() {
        const {
            x, y, stroke, value, width
        } = this.props;

        return <text x={x + width / 2} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">{value}</text>;
    }
}


export class BoothVisitor extends PureComponent {

    render() {
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Unique" fill="#ee3135" label={<CustomizedLabel />} />
                    <Bar dataKey="Time visited" fill="#999" label={<CustomizedLabel />} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
