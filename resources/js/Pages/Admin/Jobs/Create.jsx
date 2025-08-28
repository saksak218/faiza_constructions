import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useRef, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { toast, Toaster } from 'react-hot-toast';

// Component ke props mein 'measures' ko add karein
export default function Create({ auth, users, measures }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        address: '',
        status: 'Ready to Book',
        client_name: '',
        client_phone_number: '',
        assigned_person_id: users && users.length > 0 ? users[0].id : '',
        measures: [],
        inspection_image: [],
        customer_signature: null,
    });
    
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const startDrawing = (e) => {
            isDrawingRef.current = true;
            const { x, y } = getCanvasCoordinates(e);
            lastPosRef.current = { x, y };
        };

        const draw = (e) => {
            if (!isDrawingRef.current) return;
            const { x, y } = getCanvasCoordinates(e);
            const ctx = canvasRef.current.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
            lastPosRef.current = { x, y };
        };

        const stopDrawing = () => {
            isDrawingRef.current = false;
            setData('customer_signature', canvas.toDataURL());
        };

        const getCanvasCoordinates = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, []);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setData('customer_signature', null);
    };

    const handleMeasuresChange = (measureName) => {
        setData(
            'measures',
            data.measures.includes(measureName)
                ? data.measures.filter((m) => m !== measureName)
                : [...data.measures, measureName]
        );
    };

    const handleImageChange = (e) => {
        setData('inspection_image', [...data.inspection_image, ...e.target.files]);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.customer_signature) {
            toast.error('Customer signature is required.');
            return;
        }
        post(route('admin.jobs.store'), {
            onSuccess: () => {
                toast.success('Job created successfully!');
                reset();
                clearSignature();
            },
            onError: () => {
                toast.error('An error occurred. Please check the form.');
            }
        });
    };

    // Hard-coded measuresList array ko yahan se hata diya gaya hai

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create New Job</h2>}
        >
            <Head title="Create Job" />
            <Toaster position="top-right" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Baaki form fields wese hi rahenge */}
                                <div>
                                    <InputLabel htmlFor="client_name" value="Client Name" />
                                    <TextInput id="client_name" name="client_name" value={data.client_name} className="mt-1 block w-full" autoComplete="client_name" isFocused={true} onChange={(e) => setData('client_name', e.target.value)} />
                                    <InputError message={errors.client_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="client_phone_number" value="Client Phone Number" />
                                    <TextInput id="client_phone_number" type="text" name="client_phone_number" value={data.client_phone_number} className="mt-1 block w-full" autoComplete="client_phone_number" onChange={(e) => setData('client_phone_number', e.target.value)} />
                                    <InputError message={errors.client_phone_number} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput id="address" name="address" value={data.address} className="mt-1 block w-full" autoComplete="address" onChange={(e) => setData('address', e.target.value)} />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select id="status" name="status" value={data.status} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" onChange={(e) => setData('status', e.target.value)}>
                                        <option value="Ready to Book">Ready to Book</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="assigned_person_id" value="Assigned Person" />
                                    <select id="assigned_person_id" name="assigned_person_id" value={data.assigned_person_id} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" onChange={(e) => setData('assigned_person_id', e.target.value)}>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.assigned_person_id} className="mt-2" />
                                </div>

                                {/* Yahan hum dynamic 'measures' prop se checkboxes banayenge */}
                                <div className="space-y-2">
                                    <InputLabel value="Measures" />
                                    <div className="flex flex-wrap gap-4">
                                        {measures.map((measure) => (
                                            <div key={measure.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`measure-${measure.id}`}
                                                    name="measures[]"
                                                    value={measure.name} // value mein measure ka naam
                                                    checked={data.measures.includes(measure.name)}
                                                    onChange={() => handleMeasuresChange(measure.name)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`measure-${measure.id}`} className="ml-2 text-sm text-gray-600">
                                                    {measure.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.measures} className="mt-2" />
                                </div>

                                {/* Baaki form waisa hi rahega */}
                                <div className="mb-4">
                                    <InputLabel htmlFor="inspection_image" value="Inspection Images" />
                                    <input id="inspection_image" type="file" multiple onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none" />
                                    <InputError message={errors.inspection_image} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Customer Signature" />
                                    <div className="mt-1 border border-gray-300 rounded-md">
                                        <canvas ref={canvasRef} width="400" height="200" className="bg-white" style={{ touchAction: 'none' }}></canvas>
                                    </div>
                                    <div className="mt-2 flex space-x-2">
                                        <button type="button" onClick={clearSignature} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 text-sm">
                                            Clear Signature
                                        </button>
                                    </div>
                                    <InputError message={errors.customer_signature} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        Create Job
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}