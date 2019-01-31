import React, { Component } from 'react';
import { DatePicker, Spin, Select, Cascader } from 'antd';
import { XYPlot, VerticalBarSeries } from 'react-vis';
import { getBuyers } from '../../api/buyer';
import { getDepartments } from '../../api/department';
import { getRequesters } from '../../api/requester';
import { getInformation } from '../../api/information';
import { getCompanies } from '../../api/company';
import { getCategories } from '../../api/category';
import { getStatuses } from '../../api/status';
import './styles.scss';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const measures = [
    {
        title: 'Request Number',
        value: 'request_number',
    },
    {
        title: 'Total Estimated Price',
        value: 'total_estimated_price',
    },
    {
        title: 'Total Quote Price',
        value: 'total_quote_price',
    },
    {
        title: 'Savings amount',
        value: 'savings_amount',
    },
    {
        title: 'Savings %',
        value: 'savings_percent',
    },
];

class CustomChart extends Component {

    state = {
        allInformation: [],
        information: [],
        selectedMeasures: null,
        selectedDimension: [],
        options: [],
        isLoading: false,
    };

    componentDidMount() {
        this.setState({
            isLoading: true,
        });

        Promise.all([
            getCompanies(),
            getRequesters(),
            getDepartments(),
            getCategories(),
            getStatuses(),
            getBuyers(),
            getInformation(),
        ]).then(([companies, requesters, departments, categories, statuses, buyers, information]) => {
            const options = [
                {
                    value: 'company',
                    label: 'Company',
                    children: companies.map(item => ({ value: item.id, label: item.name })),
                },
                {
                    value: 'requester',
                    label: 'Requester Name',
                    children: requesters.map(item => ({ value: item.id, label: item.name })),
                },
                {
                    value: 'department',
                    label: 'Department',
                    children: departments.map(item => ({ value: item.id, label: item.name })),
                },
                {
                    value: 'category',
                    label: 'Category',
                    children: categories.map(item => ({ value: item.id, label: item.name })),
                },
                {
                    value: 'status',
                    label: 'Status',
                    children: statuses.map(item => ({ value: item.id, label: item.name })),
                },
                {
                    value: 'buyer',
                    label: 'Buyer',
                    children: buyers.map(item => ({ value: item.id, label: item.name })),
                },
            ];
            this.setState({
                options,
                information,
                allInformation: information,
                isLoading: false,
            });
        });
    }

    onChangeDimension = (value) => {
        this.setState({
            selectedDimension: value,
        }, () => {
            this.onFilterData();
        });
    }

    onChangeMeasures = (value) => {
        this.setState({
            selectedMeasures: value,
        }, () => {
            this.onFilterData();
        });
    }

    onChangeDate = (value) => {

        const [ from, to ] = value;

        this.setState({
            isLoading: true,
        });

        getInformation({ from: from && from.format('MM-DD-YYYY'), to: to && to.format('MM-DD-YYYY')}).then(response => {
            this.setState({
                information: response,
                allInformation: response,
                isLoading: false
            }, () => {
                this.onFilterData();
            });
        });
    }

    onFilterData = () => {
        const { selectedMeasures, selectedDimension } = this.state;

        if (selectedMeasures && selectedDimension.length) {
            let information = [ ...this.state.allInformation ];
            const [field, value] = selectedDimension;
            information = information.filter(item => item[field] === value);
            this.setState({
                information,
            });
        }
    }

    render() {
        const { options, information, selectedMeasures, selectedDimension, isLoading } = this.state;
        const data = information.map(item => Number(item[selectedMeasures])).filter(n => !Number.isNaN(n)).map((y, i) => ({ x: `${i}`, y, }));
        return (
            <Spin size="large" spinning={isLoading}>
                <div className="custom-chart">
                    <div className="top-filters">
                        <div className="top-filters__left">
                            <Cascader
                                className="dimensions"
                                options={options}
                                onChange={this.onChangeDimension}
                                placeholder="Select dimension"
                            />

                            <Select
                                className="measures"
                                placeholder="Select measure"
                                onChange={this.onChangeMeasures}
                                showSearch
                            >
                                {measures.map(item => <Option key={item.value}>{item.title}</Option>)}
                            </Select>
                        </div>

                        <div className="top-filters__right">
                            <RangePicker onChange={this.onChangeDate} />
                        </div>
                    </div>
                    {!selectedMeasures || !selectedDimension.length ?
                        <div className="no-data">
                            Please enter Measure and Dimension
                        </div> : !isLoading && information.length ?
                            <div className="charts">
                                <div className="charts__title">Custom Chart</div>
                                <div className="charts__items">
                                    {data.length ?
                                        <XYPlot xType="ordinal" width={600} height={400}>
                                            <VerticalBarSeries
                                                animation
                                                data={data}
                                            />
                                        </XYPlot> :
                                        <div className="no-data-chart">No Data</div>
                                    }
                                </div>
                            </div> :
                            <div className="no-data">No results</div>
                    }

                </div>
            </Spin>
        );
    }
}

export default CustomChart;