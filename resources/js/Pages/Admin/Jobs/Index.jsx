import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router  } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Job from './Job';

export default function Index({ auth, jobs, sort, direction, search, per_page }) {
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [perPage, setPerPage] = useState(per_page || 10);

    const defaultValues = {
        // name: '',
        // email: '',
        // password: '',
        id: '',
        address: '',
    };

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm(defaultValues);

    const handleClose = () => {
        setShowModal(false);
        setEditingJob(null);
        reset();
        setData(defaultValues);
        clearErrors(); // Add this line
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingJob) {
            put(route('admin.jobs.update', editingJob.id), {
                onSuccess: () => {
                    handleClose();
                    toast.success('Job updated successfully');
                },
                onError: () => {
                    toast.error('Failed to update job');
                },
            });
        } else {
            post(route('admin.jobs.store'), {
                onSuccess: () => {
                    handleClose();
                    toast.success('Job created successfully');
                },
                onError: () => {
                    toast.error('Failed to create job');
                },
            });
        }
    };

    const openEditModal = (job) => {
        clearErrors(); // Add this line
        setEditingJob(job);
        setData({
            id: job.id || '',
            address: job.address || '',
            // password: '',
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        clearErrors(); // Add this line
        setEditingJob(null);
        setData(defaultValues);
        setShowModal(true);
    };

    const openDeleteModal = (job) => {
        setJobToDelete(job);
        setDeleteModalOpen(true);
    };
    const handleDelete = () => {
        if (jobToDelete) {
            destroy(route('admin.jobs.destroy', jobToDelete.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setJobToDelete(null);
                    toast.success('Job deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete job');
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.jobs'), {
            search: searchTerm,
            sort,
            direction,
            per_page: perPage
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        router.get(route('admin.jobs'), {
            search: searchTerm,
            sort,
            direction,
            per_page: newPerPage
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Jobs
                </h2>
            }
        >
            <Toaster position="top-right" />
            <Head title="Jobs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">


                        <div className="p-6 text-gray-900">


                            <div className="mb-4 flex justify-between items-center">
                                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search users..."
                                        className="border rounded-l px-2 py-1"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-1 rounded-r"
                                    >
                                        Search
                                    </button>

                                    <select
                                        value={perPage}
                                        onChange={handlePerPageChange}
                                        className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 pr-8 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="10">10 per page</option>
                                        <option value="25">25 per page</option>
                                        <option value="50">50 per page</option>
                                        <option value="100">100 per page</option>
                                    </select>
                                </form>

                                <button
                                    onClick={openCreateModal}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Add New Job
                                </button>
                            </div>


                            <table className="min-w-full">
                                <thead>
                                <tr>
                                <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        <Link
                                            href={route('admin.jobs', {
                                                sort: 'id',
                                                direction: sort === 'id' && direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                            className={`${sort === 'id' ? 'font-bold' : ''}`}
                                        >
                                            Id {sort === 'id' && (direction === 'asc' ? '▲' : '▼')}
                                        </Link>
                                    </th>
                                    <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        <Link
                                            href={route('admin.jobs', {
                                                sort: 'address',
                                                direction: sort === 'address' && direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                            className={`${sort === 'address' ? 'font-bold' : ''}`}
                                        >
                                            Address {sort === 'address' && (direction === 'asc' ? '▲' : '▼')}
                                        </Link>
                                    </th>
                                    <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {jobs.data.map((job) => (
                                    <Job key={job.id} job={job} openEditModal={openEditModal}
                                          openDeleteModal={openDeleteModal} />
                                ))}
                                </tbody>
                            </table>


                            <div className="flex items-center justify-center space-x-2 mt-4">
                                {jobs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                        }`}
                                    >
                                        {link.label === '&laquo;' ? (
                                            <span>&#8592; {/* Left Arrow */}</span>
                                        ) : link.label === '&raquo;' ? (
                                            <span>&#8594; {/* Right Arrow */}</span>
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Link>
                                ))}
                            </div>


                            <Modal show={showModal} onClose={handleClose}>
                                <form onSubmit={submitForm} className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {editingJob
                                            ? 'Edit Job'
                                            : 'Create New Job'}
                                    </h2>

                                    <div className="mt-6">
                                        <InputLabel
                                            htmlFor="address"
                                            value="Address"
                                        />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData('address', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.address}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* <div className="mt-6">
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div> */}

                                    {/* <div className="mt-6">
                                        <InputLabel
                                            htmlFor="password"
                                            value={`Password ${editingJob ? '(leave blank to keep current)' : ''}`}
                                        />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            required={!editingUser}
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div> */}

                                    <div className="mt-6 flex justify-end">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {editingJob
                                                ? 'Update Job'
                                                : 'Create Job'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </Modal>

                            <Modal
                                show={deleteModalOpen}
                                onClose={() => setDeleteModalOpen(false)}
                            >
                                <div className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Confirm Delete
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        Are you sure you want to delete this
                                        job? This action cannot be undone.
                                    </p>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            onClick={() =>
                                                setDeleteModalOpen(false)
                                            }
                                            className="rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                        >
                                            Delete Job
                                        </button>
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
