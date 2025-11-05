export const sleep = async (duration: number) => new Promise(resolve => setTimeout(resolve, duration));
export const scrollToChild = (viewport: HTMLElement, target: HTMLElement, smooth = true) => {
    const vpRect = viewport.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const delta = tRect.left - vpRect.left;

    viewport.scrollTo({
        left: viewport.scrollLeft + delta,
        top: 0,
        behavior: smooth ? "smooth" : "auto",
    });
};
