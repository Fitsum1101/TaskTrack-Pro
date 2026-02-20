import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users } from "lucide-react";
import { AddTeamDialog } from "./_components/add-team-dialog";
import { EditMemberDialog } from "./_components/edit-member-dialog";
import { TeamCard } from "./_components/team-card";

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
  createdAt: string;
}

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Frontend Team",
    description: "Responsible for UI/UX and frontend development",
    members: [
      { id: "m1", name: "Sarah Chen", role: "Lead", avatar: "SC" },
      { id: "m2", name: "Mike Johnson", role: "Developer", avatar: "MJ" },
      { id: "m3", name: "Emma Wilson", role: "Designer", avatar: "EW" },
      { id: "m4", name: "Alex Brown", role: "Developer", avatar: "AB" },
    ],
    projects: 8,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Backend Team",
    description: "API and database development",
    members: [
      { id: "m5", name: "Alex Martinez", role: "Lead", avatar: "AM" },
      { id: "m6", name: "Jordan Lee", role: "Developer", avatar: "JL" },
      { id: "m7", name: "Casey Wilson", role: "DevOps", avatar: "CW" },
    ],
    projects: 6,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Design System",
    description: "Component library and design tokens",
    members: [
      { id: "m8", name: "Taylor Brown", role: "Lead", avatar: "TB" },
      { id: "m9", name: "Morgan Davis", role: "Designer", avatar: "MD" },
    ],
    projects: 3,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "QA & Testing",
    description: "Quality assurance and testing",
    members: [
      { id: "m10", name: "Pat Garcia", role: "Lead", avatar: "PG" },
      { id: "m11", name: "Riley Martinez", role: "QA Engineer", avatar: "RM" },
      { id: "m12", name: "Sam Anderson", role: "QA Engineer", avatar: "SA" },
    ],
    projects: 5,
    createdAt: "2024-02-10",
  },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{
    teamId: string;
    memberId: string;
    name: string;
    role: string;
  } | null>(null);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
    setIsAddTeamOpen(false);
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter((m) => m.id !== memberId),
            }
          : team,
      ),
    );
  };

  const handleEditMember = (
    teamId: string,
    memberId: string,
    name: string,
    role: string,
  ) => {
    setEditingMember({ teamId, memberId, name, role });
  };

  const handleSaveMember = (name: string, role: string) => {
    if (!editingMember) return;

    setTeams(
      teams.map((team) =>
        team.id === editingMember.teamId
          ? {
              ...team,
              members: team.members.map((m) =>
                m.id === editingMember.memberId ? { ...m, name, role } : m,
              ),
            }
          : team,
      ),
    );
    setEditingMember(null);
  };

  const handleAddMember = (teamId: string, name: string, role: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [
                ...team.members,
                {
                  id: `m${Date.now()}`,
                  name,
                  role,
                  avatar: name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase(),
                },
              ],
            }
          : team,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Teams
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize your team members
          </p>
        </div>
        <Button
          onClick={() => setIsAddTeamOpen(true)}
          className="btn-gradient rounded-lg w-full sm:w-auto"
        >
          <Plus className="mr-2 size-4" />
          Create Team
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teams by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-lg bg-secondary/50 border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-lg"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-lg"
          >
            List
          </Button>
        </div>
      </div>

      {/* Teams Grid/List */}
      {filteredTeams.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onRemoveMember={handleRemoveMember}
              onEditMember={handleEditMember}
              onAddMember={handleAddMember}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-border bg-card p-12 shadow-sm text-center">
          <Users className="mx-auto size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            No teams found
          </h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Create your first team to get started"}
          </p>
        </Card>
      )}

      {/* Dialogs */}
      <AddTeamDialog
        open={isAddTeamOpen}
        onOpenChange={setIsAddTeamOpen}
        onAddTeam={handleAddTeam}
      />

      {editingMember && (
        <EditMemberDialog
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          initialName={editingMember.name}
          initialRole={editingMember.role}
          onSave={handleSaveMember}
        />
      )}
    </div>
  );
}
