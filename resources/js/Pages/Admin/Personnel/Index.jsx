import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Pagination from '@/Components/Pagination';
import { toast, Toaster } from 'react-hot-toast';

export default function Index({ auth, items, title, routeName }) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({ name: '' });

    const openModal = (item = null) => {
        setEditingItem(item);
        setData({ name: item ? item.name : '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(route(`${routeName}.update`, editingItem.id), { onSuccess: () => { closeModal(); toast.success('Item updated.'); } });
        } else {
            post(route(`${routeName}.store`), { onSuccess: () => { closeModal(); toast.success('Item created.'); } });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{title}</h2>}>
            <Head title={title} />
            <Toaster />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-end mb-4">
                                <PrimaryButton onClick={() => openModal()}>Add New</PrimaryButton>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.data.map(item => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                                <Link href={route(`${routeName}.destroy`, item.id)} method="delete" as="button" className="text-red-600 hover:text-red-900">Delete</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={items.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">{editingItem ? 'Edit' : 'Add'} {title.slice(0, -1)}</h2>
                    <div className="mt-6">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" isFocused />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <PrimaryButton disabled={processing}>{editingItem ? 'Update' : 'Save'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}