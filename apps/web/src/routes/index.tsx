import { Button, Comment } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getArticles } from '../services/api'

export const Route = createFileRoute('/')({
    component: HomePage,
})

// The homepage in our app is technically the "Moderate" page
function HomePage() {
    const query = useQuery({
        queryKey: ['getArticlesKey'],
        queryFn: getArticles,
    })

    return (
        <>
            <Button
                onClick={() => {
                    alert('I am approved, my human told me so 💖')
                }}
                type="approved"
            />
            <Button
                onClick={() => {
                    alert('I am not yet approved 😭')
                }}
                type="approve-neutral"
            />
            <Button
                onClick={() => {
                    alert('I am rejected, nobody loves me')
                }}
                type="rejected"
            />
            <Button
                onClick={() => {
                    alert('I am not yet rejected 😍')
                }}
                type="reject-neutral"
            />
            <Button
                onClick={() => {
                    alert(
                        'I am pending a decision from up above, look at me fly 🕊️',
                    )
                }}
                type="approve-pending"
            />
            <Button
                onClick={() => {
                    alert(
                        'I am pending a decision from up above, doom is upon us 🤭',
                    )
                }}
                type="reject-pending"
            />

            <div style={{ width: '1100px', padding: '8px 16px' }}>
                <Comment
                    site="perth now"
                    user="John S"
                    datePublished="Just Now"
                    isFlagged={true}
                    isReply={true}
                    reviewedBy="Bob T"
                    articleTitle="premier open to an extra public holiday for wA"
                    articleContent="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    articleUrl="This is a URL"
                />
            </div>
        </>
    )
}
