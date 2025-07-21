// AlertComponent.jsx
import React from 'react';
import { useAlert } from '../utils/utilsAlerts';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AlertComponent = () => {
    const { alerts, removeAlert } = useAlert();

    const getAlertStyles = (type) => {
        const styles = {
            error: {
                container: 'bg-red-50 border border-red-200 text-red-800',
                icon: 'text-red-400',
                IconComponent: AlertTriangle
            },
            success: {
                container: 'bg-green-50 border border-green-200 text-green-800',
                icon: 'text-green-400',
                IconComponent: CheckCircle
            },
            warning: {
                container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
                icon: 'text-yellow-400',
                IconComponent: AlertTriangle
            },
            info: {
                container: 'bg-blue-50 border border-blue-200 text-blue-800',
                icon: 'text-blue-400',
                IconComponent: Info
            }
        };
        return styles[type] || styles.error;
    };

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50 w-80">
            {alerts.map((alert) => {
                const { IconComponent, container, icon } = getAlertStyles(alert.type);
                return (
                    <div
                        key={alert.id}
                        className={`${container} p-4 rounded-lg shadow-lg transition-all`}
                    >
                        <div className="flex items-start">
                            <IconComponent className={`w-5 h-5 ${icon} mr-3 mt-0.5`} />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{alert.message}</p>
                            </div>
                            <button onClick={() => removeAlert(alert.id)} className={`ml-3 ${icon}`}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
