import React from 'react';

const Panel = ({ children, className = "" }) => {
    const baseClassName = "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-4";

    return (
        <div className={`${baseClassName} ${className}`}>
            {children}
        </div>
    );
};

export default Panel;
