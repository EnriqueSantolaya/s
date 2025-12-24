export async function post({ request }) {
    const {variables} = await request.json();

    const {a, b, c} = variables;
    let result;

    try{
        result = a+b+c;

    } catch(error){
        return {
            status: 500,
            body: {
                error: 'An error has occurred during the efficiency calculation for a specific point',
            },
        };
    };
}