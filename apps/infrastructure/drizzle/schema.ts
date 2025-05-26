import {
    pgSchema,
    uuid,
    text,
    timestamp,
    boolean,
    primaryKey,
    serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Define the schema object
export const commentsSchema = pgSchema('comments_schema')

// Enums
export const statusChangedReasonEnum = commentsSchema.enum(
    'status_changed_reason',
    [
        'Banned Word',
        'Community Values',
        'Inappropriate Content',
        'Spam',
        'User Request',
        'Other',
    ],
)
export const commentStatusEnum = commentsSchema.enum('comment_status', [
    'pending',
    'approved',
    'rejected',
    'flagged',
])
export const statusChangedByEnum = commentsSchema.enum('status_changed_by', [
    'user',
    'community',
    'system',
])
export const statusEnum = commentsSchema.enum('status', ['open', 'closed'])
export const rolesEnum = commentsSchema.enum('roles', [
    'user',
    'moderator',
    'admin',
])

// Tables
export const sites = commentsSchema.table('sites', {
    id: serial('id').primaryKey(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow(),
})

export const users = commentsSchema.table('users', {
    id: uuid('id').primaryKey(),
    name: text('name'),
    roles: rolesEnum('roles').default('user'),
    joinedAt: timestamp('joined_at').defaultNow(),
    siteId: serial('site_id').references(() => sites.id),
})

export const sitesRelations = relations(sites, ({ many }) => ({
    users: many(users),
}))
export const usersRelations = relations(users, ({ one }) => ({
    site: one(sites, {
        fields: [users.siteId],
        references: [sites.id],
    }),
}))

export const stories = commentsSchema.table('stories', {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    author: text('author').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    commentingStatus: statusEnum('commenting_status').default('open'),
    siteId: serial('site_id')
        .notNull()
        .references(() => sites.id),
})

export const comments = commentsSchema.table('comments', {
    id: serial('id').primaryKey(),
    storyId: text('story_id')
        .notNull()
        .references(() => stories.id),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    status: commentStatusEnum('status').default('pending'),
    reviewedBy: uuid('reviewed_by').references(() => users.id),
})

export const commentsRelations = relations(comments, ({ one }) => ({
    story: one(stories, {
        fields: [comments.storyId],
        references: [stories.id],
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
}))
export const storiesRelations = relations(stories, ({ many }) => ({
    comments: many(comments),
}))
export const usersCommentsRelations = relations(users, ({ many }) => ({
    comments: many(comments),
}))

export const commentStatusChanges = commentsSchema.table(
    'comment_status_changes',
    {
        id: serial('id').primaryKey(),
        commentId: serial('comment_id')
            .notNull()
            .references(() => comments.id),
        oldStatus: commentStatusEnum('old_status'),
        newStatus: commentStatusEnum('new_status'),
        changedByUser: uuid('changed_by_user').references(() => users.id),
        changedBy: statusChangedByEnum('changed_by').default('system'),
        changedReason: statusChangedReasonEnum('changed_reason'),
        changedAt: timestamp('changed_at').defaultNow(),
    },
)

export const commentStatusChangesRelations = relations(
    commentStatusChanges,
    ({ one }) => ({
        comment: one(comments, {
            fields: [commentStatusChanges.commentId],
            references: [comments.id],
        }),
    }),
)

export const commentsStatusChangesRelations = relations(
    comments,
    ({ many }) => ({
        statusChanges: many(commentStatusChanges),
    }),
)

export const userIgnoredUsers = commentsSchema.table(
    'user_ignored_users',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id),
        ignoredUserId: uuid('ignored_user_id')
            .notNull()
            .references(() => users.id),
        ignoredAt: timestamp('ignored_at').defaultNow(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.userId, table.ignoredUserId] }),
    }),
)

export const userPreferences = commentsSchema.table('user_preferences', {
    userId: uuid('user_id')
        .primaryKey()
        .references(() => users.id),
    showBadges: boolean('show_badges').default(true),
    notifyOnReply: boolean('notify_on_reply').default(true),
    notifyOnFeatured: boolean('notify_on_featured').default(true),
    notifyOnMention: boolean('notify_on_mention').default(true),
    updatedAt: timestamp('updated_at').defaultNow(),
})
