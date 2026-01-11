/**
 * NodeIcon - Maps icon name strings to Lucide React components
 * 
 * Backend sends icon names like "Zap", "Type", "Globe", "Bot"
 * This component renders the corresponding Lucide icon
 */

import {
    Zap,
    Type,
    Globe,
    Bot,
    Timer,
    GitBranch,
    Calculator,
    Code,
    Database,
    Mail,
    FileText,
    Settings,
    Play,
    HelpCircle,
} from 'lucide-react';

// Map icon names to Lucide components
const ICON_MAP = {
    Zap,
    Type,
    Globe,
    Bot,
    Timer,
    GitBranch,
    Calculator,
    Code,
    Database,
    Mail,
    FileText,
    Settings,
    Play,
    HelpCircle,
};

function NodeIcon({ name, size = 20, className = '' }) {
    const IconComponent = ICON_MAP[name];

    if (!IconComponent) {
        // Fallback for unknown icons
        return <HelpCircle size={size} className={className} />;
    }

    return <IconComponent size={size} className={className} />;
}

export default NodeIcon;
