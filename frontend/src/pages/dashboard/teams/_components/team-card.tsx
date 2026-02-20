import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import {
  ChevronDown,
  FolderOpen,
  Edit2,
  Trash2,
  MoreVertical,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMemberDialog } from "./add-member-dialog";

interface Team {
  id: string;
  name: string;
  description: string;
  members: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  projects: number;
}

interface TeamCardProps {
  team: Team;
  onRemoveMember: (teamId: string, memberId: string) => void;
  onEditMember: (
    teamId: string,
    memberId: string,
    name: string,
    role: string,
  ) => void;
  onAddMember: (teamId: string, name: string, role: string) => void;
}

export function TeamCard({
  team,
  onRemoveMember,
  onEditMember,
  onAddMember,
}: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const displayMembers = isExpanded ? team.members : team.members.slice(0, 3);
  const hiddenMembersCount = Math.max(0, team.members.length - 3);

  return (
    <>
      <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Card Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <Link
              to={`/teams/${team.id}`}
              className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
            >
              <h3 className="text-lg font-bold text-foreground truncate">
                {team.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {team.description}
              </p>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 mt-4">
            <Badge variant="secondary" className="rounded-md text-xs">
              <Users className="size-3 mr-1" />
              {team.members.length} members
            </Badge>
            <Badge variant="secondary" className="rounded-md text-xs">
              <FolderOpen className="size-3 mr-1" />
              {team.projects} projects
            </Badge>
          </div>
        </div>

        {/* Members Preview */}
        <div className="px-6 py-4 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Team Members
          </h4>
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {displayMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-white">
                        {member.avatar}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-7"
                        onClick={() =>
                          onEditMember(
                            team.id,
                            member.id,
                            member.name,
                            member.role,
                          )
                        }
                      >
                        <Edit2 className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => onRemoveMember(team.id, member.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Hidden Members Count */}
            {!isExpanded && hiddenMembersCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground px-2 py-1"
              >
                +{hiddenMembersCount} more member
                {hiddenMembersCount > 1 ? "s" : ""}
              </motion.div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 flex gap-2 bg-secondary/20">
          <Link to={`/teams/${team.id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-lg bg-transparent"
            >
              <ArrowRight className="size-3 mr-2" />
              View Team
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-lg"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`size-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </Card>

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        teamId={team.id}
        onAddMember={(name, role) => {
          onAddMember(team.id, name, role);
          setIsAddMemberOpen(false);
        }}
      />
    </>
  );
}

interface UsersProps {
  className?: string;
}

function Users({ className }: UsersProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
