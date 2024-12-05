// src/views/private/PostsView.tsx

[{
	"resource": "/home/gabrielzochova/dev/snap-zoska-4h/src/views/private/SearchView.tsx",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type '({ user: { id: string; createdAt: Date; updatedAt: Date; name: string | null; email: string; emailVerified: Date | null; image: string | null; }; } & { id: string; userId: string; ... 5 more ...; updatedAt: Date; })[]' is not assignable to parameter of type 'SetStateAction<Profile[]>'.\n  Type '({ user: { id: string; createdAt: Date; updatedAt: Date; name: string | null; email: string; emailVerified: Date | null; image: string | null; }; } & { id: string; userId: string; ... 5 more ...; updatedAt: Date; })[]' is not assignable to type 'Profile[]'.\n    Type '{ user: { id: string; createdAt: Date; updatedAt: Date; name: string | null; email: string; emailVerified: Date | null; image: string | null; }; } & { id: string; userId: string; ... 5 more ...; updatedAt: Date; }' is not assignable to type 'Profile'.\n      Types of property 'avatarUrl' are incompatible.\n        Type 'string | null' is not assignable to type 'string | undefined'.\n          Type 'null' is not assignable to type 'string | undefined'.",
	"source": "ts",
	"startLineNumber": 38,
	"startColumn": 23,
	"endLineNumber": 38,
	"endColumn": 38
}]