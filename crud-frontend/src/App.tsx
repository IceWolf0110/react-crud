import {ThemeProvider} from "@/components/dark-mode/theme-provider.tsx";
import Products from "@/components/products/products.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Products/>
        </ThemeProvider>
    )
}

export default App
