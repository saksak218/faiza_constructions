import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { HiOutlinePencil } from 'react-icons/hi';

export default function Dashboard({ auth, jobs }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Assigned Jobs</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Welcome, {auth.user.name}!</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Job ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Address</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created At</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {jobs.length > 0 ? jobs.map((job) => (
                                            <tr key={job.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{job.address}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">{job.status}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{dayjs(job.created_at).format('YYYY-MM-DD')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {/* FIX: Extra styling classes add ki gayi hain */}
                                                    <Link href={route('jobs.edit', job.id)} className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700">
                                                        <HiOutlinePencil className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">You have no jobs assigned.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
