const countFps = (target: HTMLElement) => {
    let count = 0;

    setInterval(() => {
        target.innerText = count.toString();
        count = 0;
    }, 1000);

    const increaseFrame = () => {
        requestAnimationFrame(() => {
            count++;
            requestAnimationFrame(increaseFrame);
        });
    }
    increaseFrame();
};

export {
    countFps
};