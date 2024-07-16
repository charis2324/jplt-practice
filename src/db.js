import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function increment_times_answered_correctly(question_id) {
    let { data, error } = await supabase
        .from('questions')
        .select('times_answered_correctly')
        .eq('question_id', question_id)
        .single()

    if (error) {
        console.error('Error fetching question:', error)
        return
    }

    if (!data) {
        console.error('Question not found')
        return
    }

    // Increment the value
    const newValue = (data.times_answered_correctly || 0) + 1

    // Update the row with the new value
    const { data: updatedData, error: updateError } = await supabase
        .from('questions')
        .update({ times_answered_correctly: newValue })
        .eq('question_id', question_id)

    if (updateError) {
        console.error('Error updating question:', updateError)
        return
    }

    console.log('Successfully incremented times_answered_correctly')
    return newValue
}