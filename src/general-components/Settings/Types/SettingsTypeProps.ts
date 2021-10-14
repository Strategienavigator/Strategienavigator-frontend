export interface SettingsTypeProps {
    name: string
    description: string
    extras?: string
    value: string
    valueChanged: (newValue: string) => void
}
