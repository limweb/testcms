import React, { PureComponent } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

class CustomizedLabel extends PureComponent {
    render() {
        const {
            x, y, stroke, value, width
        } = this.props;

        return <text x={x + width / 2} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">{value}</text>;
    }
}


export class HallVisitor extends PureComponent {

    render() {

        const { data } = this.props
        const formattedData = data
            .map(d => ({ name: d.hallName, ['Time visited']: d.notUnique, ['Unique']: d.unique }))
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
