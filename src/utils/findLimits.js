export const findLimits = (accountPlan) => {
    const planMap = {
        1: 'BASIC',
        2: 'PRO',
        3: 'PREMIUM'
    };

    const plan = planMap[accountPlan] || 'BASIC';

    const textKey = `VITE_${plan}_TEXT_LIMIT`;
    const imageKey = `VITE_${plan}_IMAGE_LIMIT`;
    const fileKey = `VITE_${plan}_FILE_LIMIT`;

    const character_sizeKey = `VITE_${plan}_TEXT_CHARACTER_LIMIT`;
    const image_sizeKey = `VITE_${plan}_IMAGE_SIZE_LIMIT`;
    const file_sizeKey = `VITE_${plan}_FILE_SIZE_LIMIT`;

    const total_text_limit = parseInt(import.meta.env[textKey]);
    const total_image_limit = parseInt(import.meta.env[imageKey]);
    const total_file_limit = parseInt(import.meta.env[fileKey]);
    const text_character_limit = parseInt(import.meta.env[character_sizeKey]);
    const image_size_limit = parseInt(import.meta.env[image_sizeKey]);
    const file_size_limit = parseInt(import.meta.env[file_sizeKey]);

    return {
        total_text_limit,
        total_image_limit,
        total_file_limit,
        text_character_limit,
        image_size_limit,
        file_size_limit
    };
};
