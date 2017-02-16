angular = {
    isDefined: () => { return true; },
    element: () => {
        return {
            scope: () => {
                return { '$on': () => true };
            }
        };
    }
}
