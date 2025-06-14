import { Button } from '@repo/ui'
import './App.css'

export const App = () => {
    return (
        <>
            <Button
                text="Approved"
                backgroundColor="#D0F9D9"
                textColor="#034211"
                onClick={() => {
                    alert('bleh')
                }}
            />
            <Button
                text="Rejected"
                backgroundColor="#FFC3C7"
                textColor="#420000"
                onClick={() => {
                    alert('Rejected')
                }}
            />
        </>
    )
}
