function User({ job, openEditModal, openDeleteModal }) {
    return (
        <tr key={job.id}>
            <td className="border-b border-gray-200 px-6 py-4">
                {job.id}
                                            </td>
                                            <td className="border-b border-gray-200 px-6 py-4">
                                                {job.address}
                                            </td>
                                            <td className="border-b border-gray-200 px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(job)
                                                    }
                                                    className="mr-4 text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(job)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
            </td>
        </tr>
    );
}

export default User;
