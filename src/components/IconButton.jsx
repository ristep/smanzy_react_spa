const IconButton = ({ onClick, disabled, title, children, className = "" }) => {
    // Base styles encapsulated here
    const baseStyles = `
    text-blue-600 hover:text-blue-700
    transition-all duration-200 ease-out
    hover:-translate-y-0.5
    hover:shadow-md
    active:translate-y-0
    disabled:opacity-40 disabled:cursor-not-allowed
    disabled:hover:shadow-none disabled:hover:translate-y-0
  `;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            // Combine base styles with any extra classes passed in
            className={`${baseStyles} ${className}`}
        >
            {children}
        </button>
    );
};

export default IconButton;