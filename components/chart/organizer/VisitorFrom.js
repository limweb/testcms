import React, { Component } from 'react'
import { Pie, PieChart, Sector, ResponsiveContainer, Cell } from 'recharts'

const data = [
    { center: 'Visitors', value: 400, sum: 1400, color: '#ee3135', name: 'Internet' },
    { center: 'Visitors', value: 300, sum: 1400, color: '#999', name: 'Invitation' },
    { center: 'Visitors', value: 700, sum: 1400, color: '#000', name: 'Media' },
];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy,
        midAngle,
        innerRadius, outerRadius,
        startAngle, endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    return (
        <g>
            <text x={cx} y={cy} dy={0} textAnchor="middle" fill={'gray'}>{payload.sum}</text>
            <text x={cx} y={cy} dy={18} textAnchor="middle" fill={'gray'}>{payload.center}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={payload.color}
            />
        </g>
    );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, x, y
}) => {
    const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
    const xx = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="#999" textAnchor={'center'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

class VisitorFrom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0
        }
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    }

    render() {
        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        activeIndex={0}
                        activeShape={renderActiveShape}
                        data={data}
                        outerRadius={'90%'}
                        innerRadius={'70%'}
                        label={renderCustomizedLabel}
                        labelLine={false}
                        dataKey="value"
                    >
                        {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    }
}

export { VisitorFrom } 
