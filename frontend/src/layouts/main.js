import PropTypes from 'prop-types';
export default function Main({ children }) {
    return (
        <>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
        </>
    )
}
Main.propTypes = {
    children: PropTypes.node
};