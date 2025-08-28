import dayjs from 'dayjs';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

function Job({ job, openEditModal, openDeleteModal }) {
    return (
        <tr key={job.id}>
            <td className="border-b border-gray-200 px-6 py-4">{job.id}</td>
            <td className="border-b border-gray-200 px-6 py-4">
                {job.address}
            </td>
            <td className="border-b border-gray-200 px-6 py-4">
                <span
                    className={`${job.status === 'Ready to Book' ? 'bg-indigo-500' : job.status === 'Booked' ? 'bg-blue-500' : job.status === 'in_progress' ? 'bg-yellow-500' : job.status === 'completed' ? 'bg-green-500' : 'bg-red-500'} rounded px-2 py-0.5 text-white`}
                >
                    {job.status === 'Ready to Book'
                        ? 'Ready to Book'
                        : job.status === 'Booked'
                            ? 'Booked'
                            : job.status === 'in_progress'
                                ? 'In Progress'
                                : 'Completed'}
                </span>
            </td>
            <td className="border-b border-gray-200 px-6 py-4">
                {dayjs(job.created_at).format('MMMM DD, YYYY')} {/* created_at show kiya gaya */}
            </td>
            <td className="border-b border-gray-200 px-6 py-4">
                <button
                    onClick={() => openEditModal(job)}
                    className="mr-2 text-blue-600 hover:text-blue-900"
                >
                    <HiOutlinePencil />
                </button>
                <button
                    onClick={() => openDeleteModal(job)}
                    className="text-red-600 hover:text-red-900"
                >
                    <HiOutlineTrash />
                </button>
            </td>
        </tr>
    );
}

export default Job;
