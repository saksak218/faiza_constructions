function User({ user, openEditModal, openDeleteModal }) {
    return (
        <tr key={user.id}>
            <td className="border-b border-gray-200 px-6 py-4">
                {user.name}
                                            </td>
                                            <td className="border-b border-gray-200 px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="border-b border-gray-200 px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                    className="mr-4 text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(user)
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
