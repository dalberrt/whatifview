import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarGroupExample() {
  return (
    <AvatarGroup className="grayscale">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/dalberrt.png" alt="@dalberrt" />
        <AvatarFallback>db</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/kylerleee.png" alt="@kylerleee" />
        <AvatarFallback>kl</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}
