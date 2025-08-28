import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Modal from '@/Components/Modal';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import dayjs from 'dayjs';
import Pagination from '@/Components/Pagination'; // Pagination component ko import karein

// Job Row Component
function Job({ job, openDeleteModal }) {
    return (
        <tr key={job.id}>
            <td className="border-b border-gray-200 px-6 py-4">{job.id}</td>
            <td className="border-b border-gray-200 px-6 py-4">{job.address}</td>
            <td className="border-b border-gray-200 px-6 py-4">{job.assigned_user ? job.assigned_user.name : 'Not Assigned'}</td>
            <td className="border-b border-gray-200 px-6 py-4">
                <span className={`${job.status === 'Ready to Book' ? 'bg-indigo-500' : job.status === 'Booked' ? 'bg-blue-500' : job.status === 'In Progress' ? 'bg-yellow-500' : job.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'} rounded px-2 py-0.5 text-white text-xs`}>
                    {job.status}
                </span>
            </td>
            <td className="border-b border-gray-200 px-6 py-4">{dayjs(job.created_at).format('YYYY-MM-DD')}</td>
            <td className="border-b border-gray-200 px-6 py-4">
                <div className="flex space-x-2">
                    <Link href={route('admin.jobs.edit', job.id)} className="rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-700">
                        <HiOutlinePencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => openDeleteModal(job.id)} className="rounded-md bg-red-600 px-2 py-1 text-white hover:bg-red-700">
                        <HiOutlineTrash className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// Main Index Component
export default function Index({ auth, jobs, filters }) {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    
    // Search aur date ke liye state
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [searchDate, setSearchDate] = useState(filters.date || '');

    const openDeleteModal = (jobId) => {
        setJobToDelete(jobId);
        setDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (jobToDelete) {
            router.delete(route('admin.jobs.destroy', jobToDelete), {
                onSuccess: () => {
                    toast.success('Job deleted successfully!');
                    setDeleteModalOpen(false);
                },
                onError: () => {
                    toast.error('Failed to delete job.');
                    setDeleteModalOpen(false);
                },
            });
        }
    };
    
    // Search form submit karne par
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.jobs.index'), {
            search: searchTerm,
            date: searchDate,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Jobs Management</h2>}
        >
            <Head title="Jobs" />
            <Toaster position="top-right" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Search aur Filter Form */}
                            <div className="mb-4 flex justify-between items-center">
                                <form onSubmit={handleSearch} className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by address, client..."
                                        className="border rounded-md px-3 py-2"
                                    />
                                    <input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        className="border rounded-md px-3 py-2"
                                    />
                                    <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                        Search
                                    </button>
                                </form>
                                
                                <Link href={route('admin.jobs.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                    Add New Job
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Address</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Assigned To</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {jobs.data.map((job) => (
                                            <Job key={job.id} job={job} openDeleteModal={openDeleteModal} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={jobs.links} />
                            </div>
                            
                            <Modal show={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                                    <p className="mt-2 text-gray-600">Are you sure you want to delete this job? This action cannot be undone.</p>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button onClick={() => setDeleteModalOpen(false)} className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 hover:bg-gray-100">Cancel</button>
                                        <button onClick={handleDelete} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete Job</button>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
