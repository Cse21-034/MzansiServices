/**
 * Utility functions for handling business and branch display
 */

interface Business {
    name: string;
    isBranch?: boolean;
    branchName?: string | null;
    parentBusiness?: {
        name: string;
    } | null;
}

/**
 * Get the display name for a business or branch
 * Examples:
 * - Parent business: "FNB Bank"
 * - Branch: "FNB Bank - Main Mall Branch"
 */
export function getBusinessDisplayName(business: Business): string {
    if (!business.isBranch || !business.branchName) {
        return business.name;
    }

    return `${business.name} - ${business.branchName}`;
}

/**
 * Get a short display name for a branch (just the branch name)
 * Examples:
 * - "Main Mall Branch"
 * - "Windhoek Branch"
 */
export function getBranchShortName(business: Business): string {
    if (!business.isBranch || !business.branchName) {
        return business.name;
    }

    return business.branchName;
}

/**
 * Check if a business is a branch
 */
export function isBranch(business: Business): boolean {
    return business.isBranch === true;
}

/**
 * Get the parent business name
 */
export function getParentBusinessName(business: Business): string {
    if (business.parentBusiness) {
        return business.parentBusiness.name;
    }
    return business.name;
}
