var common = {
    testWorker:function () {
        let j = 0;
        for (let i = 0; i < 100 * 1000; i++) {
            j = j + i / 2;
        }
        console.error(j);
        return j;
    }
}