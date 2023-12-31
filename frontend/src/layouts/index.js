import PropTypes from 'prop-types';


import Header from './header.js';
import Main from './main.js';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
    return (
        <>
            <Header />
            <Main>{children}</Main>
        </>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
};