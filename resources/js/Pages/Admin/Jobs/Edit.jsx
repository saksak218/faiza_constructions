import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { toast, Toaster } from 'react-hot-toast';

// Status options
const measureStatusOptions = ['Pending', 'Ready to Book', 'Booked', 'Completed', 'In Progress'];
const invoiceStatusOptions = ['In Progress', 'Completed'];

// Yeh component har measure ki row ko render karega
const MeasureRow = ({ measure, index, handleMeasureChange, installers }) => (
    <tr key={measure.id || index}>
        <td className="border px-4 py-2 align-top">{measure.name}</td>
        <td className="border px-4 py-2 align-top text-center">
            <input
                type="checkbox"
                checked={measure.is_active}
                onChange={(e) => handleMeasureChange(index, 'is_active', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 mt-2"
            />
        </td>
        <td className="border px-4 py-2 align-top">
            <select value={measure.installer_name || ''} onChange={(e) => handleMeasureChange(index, 'installer_name', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm text-sm">
                <option value="">Select Installer</option>
                {installers.map(installer => (<option key={installer.id} value={installer.name}>{installer.name}</option>))}
            </select>
        </td>
        <td className="border px-4 py-2 align-top"><TextInput type="date" className="w-full text-sm" value={measure.pre_install_date || ''} onChange={(e) => handleMeasureChange(index, 'pre_install_date', e.target.value)} /></td>
        <td className="border px-4 py-2 align-top"><TextInput type="time" className="w-full text-sm" value={measure.pre_install_time || ''} onChange={(e) => handleMeasureChange(index, 'pre_install_time', e.target.value)} /></td>
        <td className="border px-4 py-2 align-top"><TextInput type="date" className="w-full text-sm" value={measure.post_install_date || ''} onChange={(e) => handleMeasureChange(index, 'post_install_date', e.target.value)} /></td>
        
        {/* Naye Columns */}
        <td className="border px-4 py-2 align-top">
            <select value={measure.status || ''} onChange={(e) => handleMeasureChange(index, 'status', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm text-sm">
                <option value="">Select Status</option>
                {measureStatusOptions.map(status => (<option key={status} value={status}>{status}</option>))}
            </select>
        </td>
        <td className="border px-4 py-2 align-top">
            <select value={measure.invoice_status || ''} onChange={(e) => handleMeasureChange(index, 'invoice_status', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm text-sm">
                <option value="">Select Status</option>
                {invoiceStatusOptions.map(status => (<option key={status} value={status}>{status}</option>))}
            </select>
        </td>
        <td className="border px-4 py-2 align-top">
            <textarea value={measure.notes || ''} onChange={(e) => handleMeasureChange(index, 'notes', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm text-sm" rows="2"></textarea>
        </td>
    </tr>
);

export default function EditJob({ auth, job, users, leadGenerators, surveyors, installationSupervisors, measureInstallers }) {
    const { data, setData, patch, processing, errors } = useForm({
        house_no: job.house_no || '',
        street_name: job.street_name || '',
        city: job.city || '',
        county: job.county || '',
        post_code: job.post_code || '',
        lead_generator: job.lead_generator || '',
        surveyor: job.surveyor || '',
        survey_date: job.survey_date || '',
        survey_time: job.survey_time || '',
        survey_status: job.survey_status || '',
        auditor: job.auditor || '',
        installation_supervisor: job.installation_supervisor || '',
        retrofit_coordinator: job.retrofit_coordinator || '',
        status_category: job.status_category || '',
        rejection_note: job.rejection_note || '',
        scheme_type: job.scheme_type || '',
        sub_scheme_type: job.sub_scheme_type || '',
        datamatch_status: job.datamatch_status || '',
        datamatch_status_date: job.datamatch_status_date ? new Date(job.datamatch_status_date).toISOString().slice(0, 16) : '',
        epr_floor_area_segment: job.epr_floor_area_segment || '',
        epr_pre_rating: job.epr_pre_rating || '',
        epr_post_rating: job.epr_post_rating || '',
        epr_cost_saving: job.epr_cost_saving || '',
        date_installed: job.date_installed || '',
        installation_status: job.installation_status || 'pending',
        installation_notes: job.installation_notes || '',
        measures_details: job.measures_details || [],
    });

    const handleMeasureChange = (index, field, value) => {
        const updatedMeasures = [...data.measures_details];
        updatedMeasures[index][field] = value;
        setData('measures_details', updatedMeasures);
    };

    const submit = (e) => {
        e.preventDefault();
        const routeName = auth.user.role.id === 1 ? 'admin.jobs.update' : 'jobs.update';
        patch(route(routeName, job.id), {
            onSuccess: () => toast.success('Job updated successfully!'),
            onError: () => toast.error('Failed to update job. Please check the form.'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Job - {job.address}</h2>}>
            <Head title="Edit Job" />
            <Toaster position="top-center" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                
                                {/* Address Section */}
                                <div className="mb-8 p-4 border rounded-md">
                                    <h3 className="text-lg font-bold mb-4">Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        <div><InputLabel htmlFor="house_no" value="House No" /><TextInput id="house_no" value={data.house_no} onChange={e => setData('house_no', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="street_name" value="Street Name" /><TextInput id="street_name" value={data.street_name} onChange={e => setData('street_name', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="city" value="City/Town" /><TextInput id="city" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="county" value="County Name" /><TextInput id="county" value={data.county} onChange={e => setData('county', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="post_code" value="Post Code" /><TextInput id="post_code" value={data.post_code} onChange={e => setData('post_code', e.target.value)} className="w-full mt-1" /></div>
                                    </div>
                                </div>

                                {/* Job Workers Section */}
                                <div className="mb-8 p-4 border rounded-md">
                                    <h3 className="text-lg font-bold mb-4">Job Workers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        <div>
                                            <InputLabel htmlFor="lead_generator" value="Lead Generator" />
                                            <select id="lead_generator" value={data.lead_generator} onChange={e => setData('lead_generator', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                                                <option value="">Select Lead Generator</option>
                                                {leadGenerators.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="surveyor" value="Surveyor" />
                                            <select id="surveyor" value={data.surveyor} onChange={e => setData('surveyor', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                                                <option value="">Select Surveyor</option>
                                                {surveyors.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                            </select>
                                        </div>
                                        <div><InputLabel htmlFor="survey_date" value="Survey Date" /><TextInput type="date" id="survey_date" value={data.survey_date} onChange={e => setData('survey_date', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="survey_time" value="Survey Time" /><TextInput type="time" id="survey_time" value={data.survey_time} onChange={e => setData('survey_time', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="survey_status" value="Survey Status" /><TextInput id="survey_status" value={data.survey_status} onChange={e => setData('survey_status', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="auditor" value="Auditor" /><TextInput id="auditor" value={data.auditor} onChange={e => setData('auditor', e.target.value)} className="w-full mt-1" /></div>
                                        <div>
                                            <InputLabel htmlFor="installation_supervisor" value="Installation Supervisor" />
                                            <select id="installation_supervisor" value={data.installation_supervisor} onChange={e => setData('installation_supervisor', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                                                <option value="">Select Supervisor</option>
                                                {installationSupervisors.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
                                            </select>
                                        </div>
                                        <div><InputLabel htmlFor="retrofit_coordinator" value="Retrofit Coordinator" /><TextInput id="retrofit_coordinator" value={data.retrofit_coordinator} onChange={e => setData('retrofit_coordinator', e.target.value)} className="w-full mt-1" /></div>
                                    </div>
                                </div>

                                {/* Status Category Section */}
                                <div className="mb-8 p-4 border rounded-md">
                                    <h3 className="text-lg font-bold mb-4">Status Category</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div><InputLabel htmlFor="status_category" value="Status Category" /><TextInput id="status_category" value={data.status_category} onChange={e => setData('status_category', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="scheme_type" value="Scheme Type" /><TextInput id="scheme_type" value={data.scheme_type} onChange={e => setData('scheme_type', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="datamatch_status" value="DataMatch Status" /><TextInput id="datamatch_status" value={data.datamatch_status} onChange={e => setData('datamatch_status', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="datamatch_status_date" value="DataMatch Status Date" /><TextInput type="datetime-local" id="datamatch_status_date" value={data.datamatch_status_date} onChange={e => setData('datamatch_status_date', e.target.value)} className="w-full mt-1" /></div>
                                        <div className="col-span-full"><InputLabel htmlFor="rejection_note" value="Rejection Note" /><textarea id="rejection_note" value={data.rejection_note} onChange={e => setData('rejection_note', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea></div>
                                    </div>
                                </div>

                                {/* EPC Rating Section */}
                                <div className="mb-8 p-4 border rounded-md">
                                    <h3 className="text-lg font-bold mb-4">EPC Rating From EPR</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div><InputLabel htmlFor="epr_floor_area_segment" value="EPR Floor-Area Segment" /><TextInput id="epr_floor_area_segment" value={data.epr_floor_area_segment} onChange={e => setData('epr_floor_area_segment', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="epr_pre_rating" value="EPR Pre-Rating" /><TextInput type="number" step="0.01" id="epr_pre_rating" value={data.epr_pre_rating} onChange={e => setData('epr_pre_rating', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="epr_post_rating" value="EPR Post-Rating" /><TextInput type="number" step="0.01" id="epr_post_rating" value={data.epr_post_rating} onChange={e => setData('epr_post_rating', e.target.value)} className="w-full mt-1" /></div>
                                        <div><InputLabel htmlFor="epr_cost_saving" value="EPR Cost Saving" /><TextInput type="number" step="0.01" id="epr_cost_saving" value={data.epr_cost_saving} onChange={e => setData('epr_cost_saving', e.target.value)} className="w-full mt-1" /></div>
                                    </div>
                                </div>

                                {/* Measures Table Section */}
                                {data.measures_details.length > 0 && (
                                    <div className="mb-8 p-4 border rounded-md">
                                        <h3 className="text-lg font-bold mb-4">Measures</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-auto">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th className="px-4 py-2 text-left">Measure Name</th>
                                                        <th className="px-4 py-2 text-left">Active</th>
                                                        <th className="px-4 py-2 text-left">Measure Installer</th>
                                                        <th className="px-4 py-2 text-left">Pre-Install Date</th>
                                                        <th className="px-4 py-2 text-left">Pre-Install Time</th>
                                                        <th className="px-4 py-2 text-left">Post-Install Date</th>
                                                        <th className="px-4 py-2 text-left">Measure Status</th>
                                                        <th className="px-4 py-2 text-left">Invoice Clearance</th>
                                                        <th className="px-4 py-2 text-left">Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.measures_details.map((measure, index) => (
                                                        <MeasureRow key={index} measure={measure} index={index} handleMeasureChange={handleMeasureChange} installers={measureInstallers} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Job Notes Section */}
                                <div className="mb-8 p-4 border rounded-md">
                                    <h3 className="text-lg font-bold mb-4">Job Notes</h3>
                                    <div><InputLabel htmlFor="installation_notes" value="Installation Notes" /><textarea id="installation_notes" value={data.installation_notes} onChange={(e) => setData('installation_notes', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" rows="4"></textarea></div>
                                </div>

                                <div className="flex items-center justify-end"><PrimaryButton disabled={processing}>Save Changes</PrimaryButton></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
