import React from 'react';

const Panel = ({ children, className = "" }) => {
    const baseClassName = "bg-card border border-card-border text-text-primary rounded-xl shadow-md overflow-hidden p-4 transition-all duration-300";

    return (
        <div className={`${baseClassName} ${className}`}>
            {children}
        </div>
    );
};

export default Panel;
