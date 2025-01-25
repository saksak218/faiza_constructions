import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    AlertOctagon,
    BarChart,
    CheckCircle,
    Clock,
    XCircle,
} from 'lucide-react';

export default function Dashboard({ jobs }) {
    const statusCounts = {
        total: jobs.length,
        pending: jobs.filter((job) => job.status === 'pending').length,
        in_progress: jobs.filter((job) => job.status === 'in_progress').length,
        completed: jobs.filter((job) => job.status === 'completed').length,
        cancelled: jobs.filter((job) => job.status === 'cancelled').length,
    };

    const statusDetails = [
        {
            key: 'total',
            icon: BarChart,
            label: 'Total Jobs',
            count: statusCounts.total,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            iconColor: 'text-gray-600',
        },
        {
            key: 'pending',
            icon: Clock,
            label: 'Pending Jobs',
            count: statusCounts.pending,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-800',
            iconColor: 'text-amber-600',
        },
        {
            key: 'in_progress',
            icon: AlertOctagon,
            label: 'In Progress',
            count: statusCounts.in_progress,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-600',
        },
        {
            key: 'completed',
            icon: CheckCircle,
            label: 'Completed Jobs',
            count: statusCounts.completed,
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            iconColor: 'text-green-600',
        },
        {
            key: 'cancelled',
            icon: XCircle,
            label: 'Cancelled Jobs',
            count: statusCounts.cancelled,
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            iconColor: 'text-red-600',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {statusDetails.map(
                            ({
                                key,
                                icon: Icon,
                                label,
                                count,
                                bgColor,
                                textColor,
                                iconColor,
                            }) => (
                                <div
                                    key={key}
                                    className={` ${bgColor} ${textColor} flex transform items-center space-x-4 rounded-xl p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg`}
                                >
                                    <Icon
                                        className={`h-10 w-10 ${iconColor}`}
                                    />
                                    <div>
                                        <div className="text-sm font-medium opacity-75">
                                            {label}
                                        </div>
                                        <div className="text-3xl font-bold">
                                            {count}
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
