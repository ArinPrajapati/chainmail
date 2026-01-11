/**
 * DynamicField - Renders appropriate input based on parameter type
 * 
 * Supports: text, textarea, select, number, json, checkbox
 * Includes variable picker button for templatable fields
 */

import { useState, useRef } from 'react';
import VariablePicker from './VariablePicker';

function DynamicField({ param, value, onChange, upstreamNodes }) {
    const [showPicker, setShowPicker] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const newValue = param.type === 'checkbox' ? e.target.checked : e.target.value;
        onChange(newValue);
    };

    const handleInsertVariable = (template) => {
        const input = inputRef.current;
        if (!input) {
            // Just append if no input ref
            onChange((value || '') + template);
            return;
        }

        // Insert at cursor position
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const currentValue = value || '';
        const newValue = currentValue.slice(0, start) + template + currentValue.slice(end);
        onChange(newValue);

        // Restore focus and cursor position after insert
        setTimeout(() => {
            input.focus();
            const newCursor = start + template.length;
            input.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    // Variable picker button for templatable fields
    const VariableButton = () => (
        <button
            type="button"
            className="variable-btn"
            onClick={() => setShowPicker(!showPicker)}
            title="Insert variable"
        >
            {'{x}'}
        </button>
    );

    // Wrapper with variable picker for text-like inputs
    const withVariablePicker = (input) => (
        <div className="field-with-picker">
            <div className="input-row">
                {input}
                <VariableButton />
            </div>
            {showPicker && (
                <VariablePicker
                    upstreamNodes={upstreamNodes}
                    onInsert={handleInsertVariable}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </div>
    );

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
                    {withVariablePicker(
                        <textarea
                            ref={inputRef}
                            value={value ?? param.default ?? ''}
                            onChange={handleChange}
                            placeholder={param.placeholder || ''}
                            rows={param.type === 'json' ? 3 : 4}
                        />
                    )}
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
                    {withVariablePicker(
                        <input
                            ref={inputRef}
                            type="text"
                            value={value ?? param.default ?? ''}
                            onChange={handleChange}
                            placeholder={param.placeholder || ''}
                        />
                    )}
                </div>
            );
    }
}

export default DynamicField;
