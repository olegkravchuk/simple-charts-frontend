import React, { Component } from 'react';
import { DatePicker, Spin, Select } from 'antd';
import { getBuyers } from '../../api/buyer';
import { getDepartments } from '../../api/department';
import { getRequesters } from '../../api/requester';
import { getInformation } from '../../api/information';
import Chart from '../../components/Chart';
import './styles.scss';

const Option = Select.Option;
const { RangePicker } = DatePicker;

class Home extends Component {

    state = {
        buyers: [],
        departments: [],
        requesters: [],

        selectedBuyers: [],
        selectedDepartments: [],
        selectedRequesters: [],

        allInformation: [],
        information: [],
        isLoading: false,
    };

    componentDidMount() {
        this.setState({
            isLoading: true,
        });

        Promise.all([getBuyers(), getDepartments(), getRequesters(), getInformation()])
            .then(([buyers, departments, requesters, information]) => {
                this.setState({
                    buyers,
                    departments,
                    requesters,
                    information,
                    allInformation: information,
                    isLoading: false,
                });
            });
    }

    onChangeTeamMember = (value) => {
        this.setState({
            selectedBuyers: value,
        }, () => {
            this.onFilterData();
        });
    }

    onChangeDepartment = (value) => {
        this.setState({
            selectedDepartments: value,
        }, () => {
            this.onFilterData();
        });
    }

    onChangeCountry = (value) => {
        this.setState({
            selectedRequesters: value,
        }, () => {
            this.onFilterData();
        });
    }

    onChangeDate = (value) => {

        const [ from, to ] = value;

        this.setState({
            isLoading: true
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
        const { selectedBuyers, selectedDepartments, selectedRequesters } = this.state;
        let information = [ ...this.state.allInformation ];

        if (selectedBuyers.length) {
            information = information.filter(item => selectedBuyers.includes(`${item.buyer}`));
        } else if (selectedDepartments.length) {
            information = information.filter(item => selectedDepartments.includes(`${item.department}`));
        } else if (selectedRequesters.length) {
            information = information.filter(item => selectedRequesters.includes(`${item.requester}`));
        }

        this.setState({
            information,
        });
    }

    render() {
        const { buyers, departments, requesters, information, isLoading } = this.state;
        console.log('2112', information);

        return (
            <Spin size="large" spinning={isLoading}>
                <div className="home">
                    <div className="top-filters">
                        <div className="top-filters__left">
                            <Select
                                className="team-member"
                                mode="multiple"
                                placeholder="Team Member"
                                onChange={this.onChangeTeamMember}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {buyers.map(item => <Option key={item.id}>{item.name}</Option>)}
                            </Select>

                            <Select
                                className="department"
                                mode="multiple"
                                placeholder="Department"
                                onChange={this.onChangeDepartment}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {departments.map(item => <Option key={item.id}>{item.name}</Option>)}
                            </Select>

                            <Select
                                className="country"
                                mode="multiple"
                                placeholder="Country"
                                onChange={this.onChangeCountry}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {requesters.map(item => <Option key={item.id}>{item.name}</Option>)}
                            </Select>
                        </div>

                        <div className="top-filters__right">
                            <RangePicker onChange={this.onChangeDate} />
                        </div>
                    </div>
                    {!isLoading && information.length ?
                        <div className="charts">
                            <div className="charts__title">Tail spend metrics</div>
                            <div className="charts__items">
                                <Chart data={information} />
                            </div>
                        </div> :
                        <div className="no-data">No results</div>
                    }
                </div>
            </Spin>
        );
    }
}

export default Home;