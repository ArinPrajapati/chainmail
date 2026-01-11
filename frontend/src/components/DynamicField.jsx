/**
 * DynamicField - Renders appropriate input based on parameter type
 * 
 * Supports: text, textarea, select, number, json, checkbox
 */

function DynamicField({ param, value, onChange }) {
    const handleChange = (e) => {
        const newValue = param.type === 'checkbox' ? e.target.checked : e.target.value;
        onChange(newValue);
    };

    switch (param.type) {
        case 'select':
            return (
                <div className="form-group">
                    <label>{param.label}</label>
                    <select
                        value={value ?? param.default ?? ''}
                        onChange={handleChange}
                    >
                        {param.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );

        case 'textarea':
        case 'json':
            return (
                <div className="form-group">
                    <label>{param.label}</label>
                    <textarea
                        value={value ?? param.default ?? ''}
                        onChange={handleChange}
                        placeholder={param.placeholder || ''}
                        rows={param.type === 'json' ? 3 : 4}
                    />
                </div>
            );

        case 'number':
            return (
                <div className="form-group">
                    <label>{param.label}</label>
                    <input
                        type="number"
                        value={value ?? param.default ?? ''}
                        onChange={handleChange}
                        placeholder={param.placeholder || ''}
                    />
                </div>
            );

        case 'checkbox':
            return (
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={value ?? param.default ?? false}
                            onChange={handleChange}
                        />
                        {param.label}
                    </label>
                </div>
            );

        case 'text':
        default:
            return (
                <div className="form-group">
                    <label>{param.label}</label>
                    <input
                        type="text"
                        value={value ?? param.default ?? ''}
                        onChange={handleChange}
                        placeholder={param.placeholder || ''}
                    />
                </div>
            );
    }
}

export default DynamicField;
