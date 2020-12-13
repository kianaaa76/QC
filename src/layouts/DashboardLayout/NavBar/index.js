import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Layers as StationIcon,
  Columns as LineManagementIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/default_avatar.jpg',
  jobTitle: 'Senior Developer',
  name: 'ابراهیم برهانی'
};

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'داشبورد'
  },
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: 'مدیریت ادمین ها'
  },
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'مدیریت خط تولید QC'
  },
  {
    href: '/app/settings',
    icon: StationIcon,
    title: 'مدیریت نقش ها'
  },
  {
    href: '/app/errors',
    icon: AlertCircleIcon,
    title: 'مدیریت خطاهای QC'
  },
  {
    href: '/app/productObject',
    icon: ShoppingBagIcon,
    title: 'product object'
  }
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   href: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [showingTabs, setShowingTabs] = useState([]);
const selector = useSelector(state=>state);
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const checkTabKey = (key)=>{
    switch (key) {
      case 'ErrorType':
        return {
          href: '/app/qcErrors',
          icon: AlertCircleIcon,
          title: 'مدیریت خطاهای QC'
        };
      case 'ProductLine':
        return {
          href: '/app/products',
          icon: ShoppingBagIcon,
          title: 'مدیریت خط تولید QC'
        };
      case 'QcError':
        return {
          href: '/app/errorType',
          icon: ShoppingBagIcon,
          title: 'خطاها'
        };
      case 'ProductObject':
        return {
          href: '/app/productObject',
          icon: ShoppingBagIcon,
          title: 'product object'
        };
      case 'AdminManager':
        return {
          href: '/app/customers',
          icon: UsersIcon,
          title: 'مدیریت ادمین ها'
        };
      case 'RoleManager':
        return {
          href: '/app/settings',
          icon: StationIcon,
          title: 'مدیریت نقش ها'
        };
    }
  }

  useEffect(()=>{
    let tabs =[];
    selector.tabs.map(item=>{
      tabs.push(checkTabKey(item.key))
    });
    setShowingTabs(tabs);
  },[])

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/app/account"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {showingTabs.length > 0 && showingTabs.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
