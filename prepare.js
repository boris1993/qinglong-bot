if (process.env.NODE_ENV !== 'production') {
    const husky = await import('husky');
    husky.default();
}
