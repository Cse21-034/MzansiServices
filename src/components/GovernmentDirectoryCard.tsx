"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import coatOfArmsImg from "@/images/coatofbw.webp";
import { DirectoryEntry } from "@/data/govementdirectory";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
    PhoneIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    MapPinIcon,
    XMarkIcon,
    BuildingOffice2Icon
} from "@heroicons/react/24/outline";

export interface GovernmentDirectoryCardProps {
    className?: string;
    data: DirectoryEntry;
}

const GovernmentDirectoryCard: FC<GovernmentDirectoryCardProps> = ({
    className = "",
    data,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const getTypeColor = (type: DirectoryEntry['type']) => {
        switch (type) {
            case 'ministry':
                return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'parastatal':
                return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'agency':
                return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'local_authority':
                return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'utility':
                return 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
        }
    };

    const getTypeName = (type: DirectoryEntry['type']) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className={`group relative bg-white dark:bg-neutral-900 rounded-xl border-2 border-burgundy-200 dark:border-burgundy-800 shadow-sm hover:shadow-xl hover:border-burgundy-400 dark:hover:border-burgundy-600 transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
            >
                <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <div className="relative h-32 sm:h-auto sm:w-28 overflow-hidden bg-neutral-50 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center">
                        <Image
                            src={data.image || coatOfArmsImg}
                            alt={data.image ? `${data.name} logo` : "Coat of Arms of Namibia"}
                            width={data.image ? 80 : undefined} // Adjust width for logos
                            height={data.image ? 80 : undefined} // Adjust height for logos
                            fill={data.image ? false : true} // Use fill only for coatOfArmsImg
                            className={`object-contain p-2 transition-all duration-500 group-hover:scale-110 ${data.image ? 'w-20 h-20' : ''}`}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4">
                        {/* Header */}
                        <div className="mb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight line-clamp-2 flex-1">
                                    {data.name}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(data.type)} whitespace-nowrap`}>
                                    {getTypeName(data.type)}
                                </span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            {/* Address */}
                            {(data.address || data.city) && (
                                <div className="flex items-start gap-2">
                                    <MapPinIcon className="w-4 h-4 text-burgundy-600 dark:text-burgundy-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2">
                                        {data.address && `${data.address}, `}
                                        {data.city}
                                        {data.poBox && ` • ${data.poBox}`}
                                    </p>
                                </div>
                            )}

                            {/* Phone */}
                            {data.phone && (
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-1">
                                        {data.phone}
                                    </p>
                                </div>
                            )}

                            {/* Fax */}
                            {data.fax && (
                                <div className="flex items-center gap-2">
                                    <BuildingOffice2Icon className="w-4 h-4 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                    <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-1">
                                        Fax: {data.fax}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* View Details Button */}
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                            <button className="text-xs font-semibold text-burgundy-600 dark:text-burgundy-400 hover:text-burgundy-700 dark:hover:text-burgundy-300 flex items-center gap-1">
                                View Full Details
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all border-2 border-burgundy-200 dark:border-burgundy-800">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={data.image || coatOfArmsImg}
                                                alt={data.image ? `${data.name} logo` : "Coat of Arms of Namibia"}
                                                width={data.image ? 60 : 60}
                                                height={data.image ? 60 : 60}
                                                className="object-contain"
                                            />
                                            <div>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-xl font-bold text-neutral-900 dark:text-white"
                                                >
                                                    {data.name}
                                                </Dialog.Title>
                                                <span className={`inline-block text-xs px-3 py-1 rounded-full border mt-2 ${getTypeColor(data.type)}`}>
                                                    {getTypeName(data.type)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        {/* Address */}
                                        {(data.address || data.poBox || data.city) && (
                                            <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <MapPinIcon className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Address</p>
                                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                        {data.address && <>{data.address}<br /></>}
                                                        {data.poBox && <>{data.poBox}<br /></>}
                                                        {data.city && <>{data.city}, {data.country}</>}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Phone */}
                                        {data.phone && (
                                            <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <PhoneIcon className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Phone</p>
                                                    <a href={`tel:${data.phone}`} className="text-sm text-burgundy-600 dark:text-burgundy-400 hover:underline">
                                                        {data.phone}
                                                    </a>
                                                    {data.tollfree && (
                                                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                                                            Toll Free: {data.tollfree}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fax */}
                                        {data.fax && (
                                            <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <BuildingOffice2Icon className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Fax</p>
                                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{data.fax}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Email */}
                                        {data.email && (
                                            <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <EnvelopeIcon className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Email</p>
                                                    <a href={`mailto:${data.email}`} className="text-sm text-burgundy-600 dark:text-burgundy-400 hover:underline">
                                                        {data.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Website */}
                                        {data.website && (
                                            <div className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <GlobeAltIcon className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Website</p>
                                                    <a
                                                        href={`https://${data.website.replace(/^(https?:\/\/)/, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-burgundy-600 dark:text-burgundy-400 hover:underline"
                                                    >
                                                        {data.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default GovernmentDirectoryCard;
