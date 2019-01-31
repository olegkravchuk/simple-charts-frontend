import React, { PureComponent } from 'react';
import { DatePicker, Spin, Select } from 'antd';
import { getBuyers } from '../../api/buyer';
import { getDepartments } from '../../api/department';
import { getRequesters } from '../../api/requester';
import { getInformation } from '../../api/information';
import Charts from '../../components/Charts';
import { filterInformation } from './services';
import './styles.scss';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

class Home extends PureComponent {

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
        const { selectedDepartments, selectedRequesters, allInformation } = this.state;
        this.setState({
            selectedBuyers: value,
            information: filterInformation(value, selectedDepartments, selectedRequesters, allInformation),
        });
    }

    onChangeDepartment = (value) => {
        const { selectedBuyers, selectedRequesters, allInformation } = this.state;
        this.setState({
            selectedDepartments: value,
            information: filterInformation(selectedBuyers, value, selectedRequesters, allInformation),
        });
    }

    onChangeCountry = (value) => {
        const { selectedBuyers, selectedDepartments, allInformation } = this.state;
        this.setState({
            selectedRequesters: value,
            information: filterInformation(selectedBuyers, selectedDepartments, value, allInformation),
        });
    }

    onChangeDate = (value) => {

        const [ from, to ] = value;

        this.setState({
            isLoading: true
        });

        getInformation({ from: from && from.format('MM-DD-YYYY'), to: to && to.format('MM-DD-YYYY')}).then(response => {
            const { selectedBuyers, selectedDepartments, selectedRequesters } = this.state;
            this.setState({
                information: filterInformation(selectedBuyers, selectedDepartments, selectedRequesters, response),
                allInformation: response,
                isLoading: false
            });
        });
    }

    render() {
        const { buyers, departments, requesters, information, isLoading } = this.state;
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
                                filterOption={filterOption}
                            >
                                {buyers.map(item => <Option key={item.id}>{item.name}</Option>)}
                            </Select>

                            <Select
                                className="department"
                                mode="multiple"
                                placeholder="Department"
                                onChange={this.onChangeDepartment}
                                showSearch
                                filterOption={filterOption}
                            >
                                {departments.map(item => <Option key={item.id}>{item.name}</Option>)}
                            </Select>

                            <Select
                                className="country"
                                mode="multiple"
                                placeholder="Country"
                                onChange={this.onChangeCountry}
                                showSearch
                                filterOption={filterOption}
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
                                <Charts data={information} />
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