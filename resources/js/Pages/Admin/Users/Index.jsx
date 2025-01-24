import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router  } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import User from './User';

export default function Index({ auth, users, sort, direction, search, per_page }) {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [perPage, setPerPage] = useState(per_page || 10);

    const defaultValues = {
        name: '',
        email: '',
        password: '',
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
        setEditingUser(null);
        reset();
        setData(defaultValues);
        clearErrors(); // Add this line
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('admin.users.update', editingUser.id), {
                onSuccess: () => {
                    handleClose();
                    toast.success('User updated successfully');
                },
                onError: () => {
                    toast.error('Failed to update user');
                },
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    handleClose();
                    toast.success('User created successfully');
                },
                onError: () => {
                    toast.error('Failed to create user');
                },
            });
        }
    };

    const openEditModal = (user) => {
        clearErrors(); // Add this line
        setEditingUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            password: '',
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        clearErrors(); // Add this line
        setEditingUser(null);
        setData(defaultValues);
        setShowModal(true);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };
    const handleDelete = () => {
        if (userToDelete) {
            destroy(route('admin.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                    toast.success('User deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete user');
                },
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users'), {
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
        router.get(route('admin.users'), {
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
                    Users
                </h2>
            }
        >
            <Toaster position="top-right" />
            <Head title="Users" />

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
                                    Add New User
                                </button>
                            </div>


                            <table className="min-w-full">
                                <thead>
                                <tr>
                                <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        <Link
                                            href={route('admin.users', {
                                                sort: 'name',
                                                direction: sort === 'name' && direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                            className={`${sort === 'name' ? 'font-bold' : ''}`}
                                        >
                                            Name {sort === 'name' && (direction === 'asc' ? '▲' : '▼')}
                                        </Link>
                                    </th>
                                    <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        <Link
                                            href={route('admin.users', {
                                                sort: 'email',
                                                direction: sort === 'email' && direction === 'asc' ? 'desc' : 'asc'
                                            })}
                                            className={`${sort === 'email' ? 'font-bold' : ''}`}
                                        >
                                            Email {sort === 'email' && (direction === 'asc' ? '▲' : '▼')}
                                        </Link>
                                    </th>
                                    <th className="border-b-2 border-gray-200 px-6 py-3 text-left">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.data.map((user) => (
                                    <User key={user.id} user={user} openEditModal={openEditModal}
                                          openDeleteModal={openDeleteModal} />
                                ))}
                                </tbody>
                            </table>


                            <div className="flex items-center justify-center space-x-2 mt-4">
                                {users.links.map((link, index) => (
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
                                        {editingUser
                                            ? 'Edit User'
                                            : 'Create New User'}
                                    </h2>

                                    <div className="mt-6">
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name"
                                        />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="mt-6">
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
                                    </div>

                                    <div className="mt-6">
                                        <InputLabel
                                            htmlFor="password"
                                            value={`Password ${editingUser ? '(leave blank to keep current)' : ''}`}
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
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {editingUser
                                                ? 'Update User'
                                                : 'Create User'}
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
                                        user? This action cannot be undone.
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
                                            Delete User
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
