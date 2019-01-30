import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import './styles.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends Component {
    state = {
        current: 'dashboard',
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.Item key="dashboard">
                    Dashboard
                </Menu.Item>
                <Menu.Item key="precision-buying">
                    Precision Buying
                </Menu.Item>
                <Menu.Item key="requests">
                    Requests
                </Menu.Item>
                <Menu.Item key="travel">
                    Travel
                </Menu.Item>
                <Menu.Item key="analytics">
                    Analytics
                </Menu.Item>

                <SubMenu
                    style={{float: 'right'}}
                    title={
                        <span className="submenu-title-wrapper">
                            <Icon type="user" style={{ fontSize: '20px' }} />
                            Oleg Kravchuk
                        </span>
                    }
                >
                    <MenuItemGroup title="Profile">
                        <Menu.Item key="setting:1">Settings</Menu.Item>
                        <Menu.Item key="setting:2">Personal Info</Menu.Item>
                    </MenuItemGroup>
                    <Menu.Item key="logout">Logout</Menu.Item>
                </SubMenu>
                <Menu.Item style={{float: 'right'}} key="notification">
                    <Icon type="notification" style={{ fontSize: '20px' }} />
                </Menu.Item>
                <Menu.Item style={{float: 'right'}} key="shopping-cart">
                    <Icon type="shopping-cart" style={{ fontSize: '20px' }} />
                </Menu.Item>

            </Menu>
        );
    }
}

export default Header;